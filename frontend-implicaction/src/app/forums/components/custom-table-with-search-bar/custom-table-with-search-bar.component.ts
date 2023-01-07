import { Component, Input, OnInit } from '@angular/core';
import { BaseWithPaginationAndFilterComponent } from '../../../shared/components/base-with-pagination-and-filter/base-with-pagination-and-filter.component';
import { Group } from '../../model/group';
import { Criteria } from '../../../shared/models/Criteria';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { finalize } from 'rxjs/operators';
import { ToasterService } from '../../../core/services/toaster.service';
import { PostService } from '../../services/post.service';
import { Post } from '../../model/post';
import {
  ForumTableTypeCode,
  ForumTableTypesEnum,
} from '../../enums/table-type-enum';
import { Constants } from 'src/app/config/constants';

@Component({
  selector: 'app-custom-table-with-search-bar',
  templateUrl: './custom-table-with-search-bar.component.html',
  styleUrls: ['./custom-table-with-search-bar.component.scss'],
})
export class CustomTableWithSearchBarComponent
  extends BaseWithPaginationAndFilterComponent<Group, Criteria>
  implements OnInit
{
  @Input() tableType: ForumTableTypesEnum;
  @Input() labels: string[];

  readonly ROWS_PER_PAGE_OPTIONS = [5];
  isLoading = true;
  posts: Post[];
  searchValue: string = '';
  searchOn: boolean = false;
  tagFilteredData: Group[];
  currentTag: number;
  forumTableType: ForumTableTypeCode = ForumTableTypeCode.FORUM;
  postTableType: ForumTableTypeCode = ForumTableTypeCode.POST;

  constructor(
    private toastService: ToasterService,
    private groupService: GroupService,
    private postService: PostService,
    protected route: ActivatedRoute
  ) {
    super(route);
  }

  ngOnInit(): void {
    this.pageable.rowsPerPages = this.ROWS_PER_PAGE_OPTIONS;
    this.pageable.rows = this.ROWS_PER_PAGE_OPTIONS[0];
    this.groupService.filterTag.subscribe((tag) => {
      if (tag) {
        console.log(tag);

        if (tag.value === this.currentTag && tag.active) {
          tag.active = false;
          this.innerPaginate();
        }
        this.currentTag = tag.value;
        this.pageable.content = tag.callBack(this.pageable.content as Group[]);
      }
    });
    this.innerPaginate();
  }

  clearSearch() {
    this.searchValue = '';
    if (this.searchOn) {
      this.search();
    }
  }

  search() {
    if (this.tableType.code === ForumTableTypeCode.FORUM) {
      if (this.searchValue) {
        this.groupService
          .findGroupByName(this.pageable, this.searchValue)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(
            (data) => {
              this.pageable.totalPages = data.totalPages;
              this.pageable.totalElements = data.totalElements;
              this.pageable.content = data.content;
            },
            () =>
              this.toastService.error(
                'Oops',
                'Une erreur est survenue lors de la recherche du groupe: ' +
                  this.searchValue
              )
          );
        this.searchOn = true;
      } else {
        this.groupService
          .getAllGroups(this.pageable)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(
            (data) => {
              this.pageable.totalPages = data.totalPages;
              this.pageable.totalElements = data.totalElements;
              this.pageable.content = data.content;
              this.setRandomTag();
            },
            () =>
              this.toastService.error(
                'Oops',
                'Une erreur est survenue lors de la recherche du groupe: ' +
                  this.searchValue
              )
          );
        this.searchOn = false;
      }
    }
    if (this.tableType.code === ForumTableTypeCode.POST) {
      if (this.searchValue) {
        this.postService
          .findPostByName(this.pageable, this.searchValue)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(
            (data) => {
              this.pageable.totalPages = data.totalPages;
              this.pageable.totalElements = data.totalElements;
              this.posts = data.content;
            },
            () =>
              this.toastService.error(
                'Oops',
                'Une erreur est survenue lors de la recherche de post: ' +
                  this.searchValue
              )
          );
        this.searchOn = true;
      } else {
        this.postService
          .getLatestPosts(10)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(
            (data) => {
              this.posts = data;
            },
            () =>
              this.toastService.error(
                'Oops',
                'Une erreur est survenue lors de la récupération de la liste des posts les plus récent'
              )
          );
        this.searchOn = false;
      }
    }
  }

  sortBy(property: keyof Group, sortOrder: number) {
    return function (a: Group, b: Group) {
      if (typeof a[property] !== 'number') {
        return 0;
      }
      const result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  }

  setRandomTag() {
    this.pageable.content.map((content) => {
      Object.assign(content, {
        tagList: [
          Constants.TAG_LIST_DEMO[
            Math.floor(Math.random() * Constants.TAG_LIST_DEMO.length)
          ],
        ],
      });
    });
  }

  protected innerPaginate(): void {
    if (this.tableType.code === ForumTableTypeCode.FORUM) {
      this.groupService
        .getAllGroups(this.pageable)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(
          (data) => {
            this.pageable.totalPages = data.totalPages;
            this.pageable.totalElements = data.totalElements;
            this.pageable.content = data.content;
            this.setRandomTag();
          },
          () =>
            this.toastService.error(
              'Oops',
              'Une erreur est survenue lors de la récupération de la liste des groupes'
            )
        );
    }
    if (this.tableType.code === ForumTableTypeCode.POST) {
      this.postService
        .getLatestPosts(10)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(
          (data) => {
            this.posts = data;
          },
          () =>
            this.toastService.error(
              'Oops',
              'Une erreur est survenue lors de la récupération de la liste des groupes'
            )
        );
    }
  }
}
