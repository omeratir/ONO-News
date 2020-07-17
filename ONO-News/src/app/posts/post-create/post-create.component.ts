import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import { AuthService } from '../../auth/auth.service';
import { Category } from 'src/app/category/category.model';
import { CategoriesService } from 'src/app/category/categories.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit, OnDestroy {
  monthString;
  dayString;
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'postcreate';
  private postId: string;
  private authStatusSub: Subscription;

  categories: Category[] = [

  ];

  private categoriesSub: Subscription;

  categoriesPerPage = 100;
  currentPage = 1;
  totalCategories = 0;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    public categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });

    this.categoriesService.getCategories(this.categoriesPerPage, this.currentPage);
    this.categoriesSub = this.categoriesService
        .getCategoryUpdateListener()
        .subscribe((postData: { categories: Category[]; categoryCount: number }) => {
          this.isLoading = false;
          this.totalCategories = postData.categoryCount;
          this.categories = postData.categories;
        });
    const date = new Date();
    console.log('full date = ' + date);
    const year = date.getFullYear();
    console.log('year = ' + year);
    const month = date.getMonth() + 1;
    console.log('month = ' + month);
    const day = date.getUTCDate();
    console.log('day = ' + day);

    if (day < 10) {
      this.dayString = '0' + day;
    } else {
      this.dayString = day.toString();
    }
    if (month < 10) {
      this.monthString = '0' + month;
    } else {
      this.monthString = month.toString();
    }

    const dateFormat = year.toString() + '-' + this.monthString + '-' + this.dayString;

    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      category: new FormControl(null, { validators: [Validators.required] }),
      content: new FormControl(null, { validators: [Validators.required] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            category: postData.category,
            content: postData.content,
            date: dateFormat,
            creator: postData.creator
          };
          this.form.setValue({
            title: this.post.title,
            category: this.post.category,
            content: this.post.content,
          });
        });
      } else {
        this.mode = 'postcreate';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    const date = new Date();
    console.log('full date = ' + date);
    const year = date.getFullYear();
    console.log('year = ' + year);
    const month = date.getMonth() + 1;
    console.log('month = ' + month);
    const day = date.getUTCDate();
    console.log('day = ' + day);

    if (day < 10) {
      this.dayString = '0' + day;
    } else {
      this.dayString = day.toString();
    }
    if (month < 10) {
      this.monthString = '0' + month;
    } else {
      this.monthString = month.toString();
    }

    const dateFormat = year.toString() + '-' + this.monthString + '-' + this.dayString;

    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'postcreate') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.category,
        this.form.value.content
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.category,
        this.form.value.content,
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
