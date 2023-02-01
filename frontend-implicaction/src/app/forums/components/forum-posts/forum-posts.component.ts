import {Component, OnInit} from '@angular/core';
<<<<<<< HEAD
import {ForumTableTypesEnum} from '../../enums/table-type-enum';
import {MenuItem} from 'primeng/api';
import {
  BaseWithPaginationAndFilterComponent
} from '../../../shared/components/base-with-pagination-and-filter/base-with-pagination-and-filter.component';
import {Criteria} from '../../../shared/models/Criteria';
import {ActivatedRoute} from '@angular/router';
import {Post} from '../../model/post';
import {finalize} from 'rxjs/operators';
import {ToasterService} from '../../../core/services/toaster.service';
import {PostService} from '../../services/post.service';
import {SidebarService} from '../../../shared/services/sidebar.service';
import {CreatePostFormComponent} from '../create-post-form/create-post-form.component';
=======
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { BaseWithPaginationAndFilterComponent } from 'src/app/shared/components/base-with-pagination-and-filter/base-with-pagination-and-filter.component';
import { Criteria } from 'src/app/shared/models/Criteria';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import {ForumTableTypesEnum} from "../../enums/table-type-enum";
import { Group } from '../../model/group';
import { PostService } from '../../services/post.service';
import {finalize} from 'rxjs/operators';
>>>>>>> [SGSA-107] creation du tableau pour les post d'un forum

@Component({
  selector: 'app-forum-posts',
  templateUrl: './forum-posts.component.html',
  styleUrls: ['./forum-posts.component.scss'],
})
<<<<<<< HEAD
export class ForumPostsComponent
  extends BaseWithPaginationAndFilterComponent<Post, Criteria>
  implements OnInit {
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
=======
export class ForumPostsComponent extends BaseWithPaginationAndFilterComponent<Group, Criteria>
  implements OnInit  {

  tableType = ForumTableTypesEnum;
  readonly ROWS_PER_PAGE_OPTIONS = [5];

  forumId: number;
  topRange: number = 7;
  isLoading = false;

  constructor(
    protected route: ActivatedRoute,
    private toastService: ToasterService,
    private postService: PostService,
    private sidebarService: SidebarService
  ) {
    super(route);
  }

  ngOnInit() {
    this.isLoading = true
    this.pageable.rowsPerPages = this.ROWS_PER_PAGE_OPTIONS;
    this.pageable.rows = this.ROWS_PER_PAGE_OPTIONS[0];
    this.route.params.subscribe(params => {
      console.log(params['forumId']) //log the value of id
      this.forumId = params['forumId'];
    });
    if (this.forumId) {
      this.innerPaginate()
    }
 
  }

  protected innerPaginate(): void {
    this.postService
      .getPostsByForumId(this.pageable, this.forumId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        (data) => {
          console.log(data.content)
          this.pageable.totalPages = data.totalPages;
          this.pageable.totalElements = data.totalElements;
          this.pageable.content = data.content;
          this.pageable.rowsPerPages = this.ROWS_PER_PAGE_OPTIONS;
          this.pageable.rows = this.ROWS_PER_PAGE_OPTIONS[0];
        },
        () =>
          this.toastService.error(
            'Oops',
            'Une erreur est survenue lors de la récupération de la liste des groupes'
          )
      );
>>>>>>> [SGSA-107] creation du tableau pour les post d'un forum
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
