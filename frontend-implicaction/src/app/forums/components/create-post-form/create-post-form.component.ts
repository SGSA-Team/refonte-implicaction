import {Component, OnInit} from '@angular/core';
import {SidebarContentComponent} from '../../../shared/models/sidebar-props';
import {PostPayload} from '../../model/post-payload';
import {UntypedFormControl, UntypedFormGroup, Validators,} from '@angular/forms';
import {Group} from '../../model/group';
import {Router} from '@angular/router';
import {PostService} from '../../services/post.service';
import {GroupService} from '../../services/group.service';
import {ToasterService} from '../../../core/services/toaster.service';
import {Univers} from '../../../shared/enums/univers';
import {Constants} from '../../../config/constants';
import {AuthService} from '../../../shared/services/auth.service';
import {User} from '../../../shared/models/user';
import {SidebarService} from '../../../shared/services/sidebar.service';

@Component({
  selector: 'app-create-post-form',
  templateUrl: './create-post-form.component.html',
  styleUrls: ['./create-post-form.component.scss'],
})
export class CreatePostFormComponent
  extends SidebarContentComponent
  implements OnInit {
  createPostForm: UntypedFormGroup;
  editorConfig: any;
  postPayload: PostPayload = {name: '', groupId: ''};
  groups: Group[];
  currentUser: User = {};
  currentParamGroupId: string;
  currentGroup: Group;
  selectedGroup: Group;
  constant = Constants;

  constructor(
    private router: Router,
    private authService: AuthService,
    private postService: PostService,
    private groupService: GroupService,
    private toasterService: ToasterService,
    private sidebarService: SidebarService
  ) {
    super();
  }

  ngOnInit(): void {
    this.editorConfig = {
      plugins: 'lists link image table code help wordcount media save',
      media_live_embeds: true,
      language: 'fr_FR',
      placeholder: 'Contenu du post',
      branding: false,
    };
    this.sidebarService.getContent().subscribe((sidebarData) => {
      this.currentParamGroupId = sidebarData.groupId;
    });
    this.createPostForm = new UntypedFormGroup({
      name: new UntypedFormControl('', Validators.required),
      url: new UntypedFormControl(''),
      description: new UntypedFormControl(''),
    });
    this.currentUser = this.authService.getCurrentUser();

    this.groupService.getAllGroups(Constants.ALL_VALUE_PAGEABLE).subscribe(
      (data) => {
        this.groups = data.content;
        this.currentGroup = this.groups.find(
          (group) => String(group.id) === this.currentParamGroupId
        );
      },
      () =>
        this.toasterService.error(
          'Oops',
          'Une erreur est survenue lors de la récupération des groupes'
        )
    );
  }

  createPost(): void {
    if (this.createPostForm.invalid) {
      return;
    }

    this.postPayload.name = this.createPostForm.get('name').value;
    this.postPayload.groupId =
      this.selectedGroup?.id ?? this.currentParamGroupId;
    this.postPayload.description = this.createPostForm.get('description').value;

    this.postService.createPost(this.postPayload).subscribe(
      (post) =>
        this.router
          .navigateByUrl(`${Univers.FORUMS.url}/${post.id}`)
          .then(() =>
            this.toasterService.success(
              'Succès',
              'Votre forum a été créée avec succès'
            )
          ),
      () =>
        this.toasterService.error(
          'Oops',
          'Une erreur est survenue lors de la création de votre forum'
        ),
      () => this.sidebarService.close()
    );
  }
}
