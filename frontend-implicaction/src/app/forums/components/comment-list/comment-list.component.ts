import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild,} from '@angular/core';
import {AuthService} from '../../../shared/services/auth.service';
import {Constants} from '../../../config/constants';
import {ToasterService} from '../../../core/services/toaster.service';
import {PostService} from '../../services/post.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {Comment} from '../../model/comment';
import {
  BaseWithPaginationAndFilterComponent
} from '../../../shared/components/base-with-pagination-and-filter/base-with-pagination-and-filter.component';
import {CommentPayload} from '../../model/comment-payload';
import {UntypedFormControl, UntypedFormGroup, Validators,} from '@angular/forms';
import {CommentService} from '../../services/comment.service';
import {Paginator} from 'primeng/paginator';
import {Criteria} from '../../../shared/models/Criteria';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
})
export class CommentListComponent
  extends BaseWithPaginationAndFilterComponent<Comment, Criteria>
  implements OnInit, OnDestroy {
  readonly ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

  @ViewChild('paginator', {static: true})
  paginator: Paginator;

  @Output()
  countChange: EventEmitter<number> = new EventEmitter();
  currentUserImageUrl = Constants.USER_IMAGE_DEFAULT_URI;
  subscription: Subscription;
  postId: string;
  forumId: string;
  currentCommentResponse: Comment | null;
  createCommentForm: UntypedFormGroup;
  commentPayload: CommentPayload;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    protected route: ActivatedRoute,
    private toasterService: ToasterService,
    private commentService: CommentService
  ) {
    super(route);
  }

  emitCountChange(): void {
    this.countChange.emit(this.pageable.totalElements);
  }

  ngOnInit(): void {
    this.pageable.rows = this.ROWS_PER_PAGE_OPTIONS[0]
    this.subscription = this.route.paramMap.subscribe((paramMap) => {
      this.postId = paramMap.get('postId');
      this.forumId = paramMap.get('forumId')
      this.commentPayload = {
        username: '',
        groupId: this.forumId,
        text: '',
        postId: this.postId,
      };

      this.innerPaginate();
    });

    this.createCommentForm = new UntypedFormGroup({
      text: new UntypedFormControl('', Validators.minLength(1)),
    });
  }

  postComment(): void {
    if (
      this.createCommentForm.invalid ||
      this.createCommentForm.get('text').value.length === 0
    ) {
      return;
    }

    this.commentPayload.text = this.createCommentForm.get('text').value;
    this.commentPayload.responseId = this.currentCommentResponse?.id

    this.commentService.postComment(this.commentPayload).subscribe(
      () => {
        // réinitialisation du formulaire
        this.createCommentForm.get('text').setValue('');
        // on force le changement de page pour la positionner à la dernière page (cad là où sera affiché le commentaire créé)
        this.pageable.page = this.getNewCommentPage();

        this.paginate(this.pageable);
        this.paginator.changePage(this.pageable.page);
      },
      () =>
        this.toasterService.error(
          'Oops',
          `Une erreur est survenue lors de l'ajout du commentaire`
        )
    );
  }

  setCommentResponse(comment: Comment) {
    this.currentCommentResponse = comment
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  protected innerPaginate(): void {
    this.postService
      .getCommentsByPostId(this.pageable, this.postId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        (data) => {
          this.pageable.totalPages = data.totalPages;
          this.pageable.totalElements = data.totalElements;
          this.pageable.content = data.content;
          this.emitCountChange();
        },
        () =>
          this.toasterService.error(
            'Oops',
            'Une erreur est survenue lors de la récupération des commentaires'
          )
      );
  }

  private getNewCommentPage(): number {
    const totalEltWithNewComment = this.pageable.totalElements + 1;
    const totalPage = Math.ceil(totalEltWithNewComment / this.pageable.rows);
    return totalPage > 0 ? totalPage - 1 : 0;
  }
}
