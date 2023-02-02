import {Component, Input, OnInit} from '@angular/core';
import {
  BaseWithPaginationAndFilterComponent
} from '../../../shared/components/base-with-pagination-and-filter/base-with-pagination-and-filter.component';
import {Group} from '../../model/group';
import {Criteria} from '../../../shared/models/Criteria';
import {ActivatedRoute} from '@angular/router';
import {GroupService} from '../../services/group.service';
import {finalize} from 'rxjs/operators';
import {ToasterService} from '../../../core/services/toaster.service';
import {PostService} from '../../services/post.service';
import {Post} from '../../model/post';
import {ForumTableTypeCode, ForumTableTypesEnum,} from '../../enums/table-type-enum';
import {SortDirectionNumberEnum, SortParameterCode, SortParametersEnum,} from '../../enums/sort-parameters-enum';
import {SortDirectionEnum} from 'src/app/shared/enums/sort-direction.enum';
import {Constants} from 'src/app/config/constants';

@Component({
  selector: 'app-custom-table-with-search-bar',
  templateUrl: './custom-table-with-search-bar.component.html',
  styleUrls: ['./custom-table-with-search-bar.component.scss'],
})
export class CustomTableWithSearchBarComponent
  extends BaseWithPaginationAndFilterComponent<any, Criteria>
  implements OnInit {
  @Input() tableType: ForumTableTypesEnum;
  @Input() labels: string[];

  @Input() getData: any;

  readonly ROWS_PER_PAGE_OPTIONS = [5];
  isLoading = true;
  posts: Post[];
  filtered: boolean = false;
  searchValue: string = '';
  searchOn: boolean = false;
  currentTag: number;
  filteredTagData: Group[] = [];
  tableTypeCode = ForumTableTypeCode;
  forumTableType: ForumTableTypeCode = ForumTableTypeCode.FORUM;
  postTableType: ForumTableTypeCode = ForumTableTypeCode.POST;
  currentSortColumn: string;
  SortDirEnum = SortDirectionEnum;

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
    this.groupService.filterTag$.subscribe((tags) => {
      if (tags && tags.length) {
        this.filteredTagData = this.pageable.content as Group[];
        tags.map((tag) => {
          return (this.filteredTagData = tag.callBack(
            this.filteredTagData as Group[]
          ));
        });
        this.filtered = true;
      } else {
        this.innerPaginate();
        this.filtered = false;
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

  sortForumData(column: string) {
    if (this.tableType.code === ForumTableTypeCode.FORUM) {
      if (this.filtered) {
        this.filteredTagData.sort(this.sortByColumn<Group>(column));
      } else {
        this.pageable.content.sort(this.sortByColumn<Group>(column));
      }
    } else if (this.tableType.code === ForumTableTypeCode.POST) {
      this.posts.sort(this.sortByColumn<Post>(column));
    }
  }

  sortByColumn<T>(column: string) {
    this.currentSortColumn = column;
    const enumParam = SortParametersEnum.from(SortParameterCode[column]);
    const sortLogic = (sortDir: SortDirectionNumberEnum) => {
      return (a: T, b: T) => {
        if (a[enumParam.label] < b[enumParam.label]) {
          return -1 * sortDir;
        }
        if (a[enumParam.label] > b[enumParam.label]) {
          return 1 * sortDir;
        }
        return 0;
      };
    };
    let sortDir: SortDirectionNumberEnum;

    if (this.pageable.sortOrder === SortDirectionEnum.ASC) {
      sortDir = SortDirectionNumberEnum.ASC;
      this.pageable.sortOrder = SortDirectionEnum.DESC;
      return sortLogic(sortDir);
    }
    this.pageable.sortOrder = SortDirectionEnum.ASC;
    sortDir = SortDirectionNumberEnum.DESC;
    return sortLogic(sortDir);
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
              this.pageable.content = data.content;
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
              this.pageable.content = data;
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

  setRandomTag() {
    this.pageable.content.map((content, index) => {
      if (index % 2 === 0) {
        Object.assign(content, {
          tagList: ['Recherche', 'Offre'],
        });
      } else {
        Object.assign(content, {
          tagList: [
            Constants.TAG_LIST_DEMO[
              Math.floor(Math.random() * Constants.TAG_LIST_DEMO.length)
              ],
          ],
        });
      }
    });
  }

  /*ngOnDestroy(): void {
    this.groupService.filterTag$.next([])
  }*/

  protected innerPaginate(): void {
    this.getData(this.pageable)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        (data) => {
          this.pageable.content = data.content || data;
          if (data.totalPages && data.totalElements) {
            this.pageable.totalPages = data.totalPages;
            this.pageable.totalElements = data.totalElements;
          }
        },
        () =>
          this.toastService.error(
            'Erreur',
            'Une erreur est survenue lors de la récupération de la liste'
          )
      );
  }
}
