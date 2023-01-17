import { Component, OnInit } from '@angular/core';
import { ForumTableTypesEnum } from '../../enums/table-type-enum';
import { MenuItem } from 'primeng/api';
import { BaseWithPaginationAndFilterComponent } from '../../../shared/components/base-with-pagination-and-filter/base-with-pagination-and-filter.component';
import { Criteria } from '../../../shared/models/Criteria';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../model/post';
import { finalize } from 'rxjs/operators';
import { ToasterService } from '../../../core/services/toaster.service';
import { PostService } from '../../services/post.service';
import { SidebarService } from '../../../shared/services/sidebar.service';
import { CreatePostFormComponent } from '../create-post-form/create-post-form.component';

@Component({
  selector: 'app-forum-posts',
  templateUrl: './forum-posts.component.html',
  styleUrls: ['./forum-posts.component.scss'],
})
export class ForumPostsComponent
  extends BaseWithPaginationAndFilterComponent<Post, Criteria>
  implements OnInit
{
  readonly ROWS_PER_PAGE_OPTIONS = [5];
  optionsTopMenu: MenuItem[];
  tableType = ForumTableTypesEnum;
  topRange: number = 7;
  forumId: string;

  constructor(
    protected route: ActivatedRoute,
    private toastService: ToasterService,
    private postService: PostService,
    private sidebarService: SidebarService
  ) {
    super(route);
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.forumId = params.forumId;
    });
    this.isLoading = true;
    this.pageable.rowsPerPages = this.ROWS_PER_PAGE_OPTIONS;
    this.pageable.rows = this.ROWS_PER_PAGE_OPTIONS[0];
    this.innerPaginate();
    this.optionsTopMenu = [
      {
        label: '7 jours',
        icon: 'pi pi-fw pi-calendar',
        command: (event) => {
          this.isLoading = true;
          this.innerPaginate();
        },
      },
      {
        label: '30 jours',
        icon: 'pi pi-fw pi-calendar',
        command: (event) => {
          this.pageable.content = this.pageable.content.slice(0, 2);
        },
      },
    ];
  }

  openSidebarCreationPost(): void {
    this.sidebarService.open({
      component: CreatePostFormComponent,
      title: 'Créer un post',
      width: 800,
      groupId: this.forumId,
    });
  }

  protected innerPaginate(): void {
    this.postService
      .getPopularPostsByForum(this.pageable, this.forumId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        (data) => {
          this.pageable.content = data.content;
        },
        () =>
          this.toastService.error(
            'Oops',
            'Une erreur est survenue lors de la récupération de la liste des groupes'
          )
      );
  }
}
