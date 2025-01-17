import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from '../../auth/auth.service';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  @ViewChild('search', {static: false}) searchInput: any;
  @ViewChild('searchcategory', {static: false}) searchCategoryInput: any;
  @ViewChild('searchdate', {static: false}) searchDateInput: any;

  title = '';
  category = '';

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 100;
  postslength = 1;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  userEmail: string;
  date = '';

  lastChar = '';
  flag = true;

  // tslint:disable-next-line: variable-name
  post_temp_title: string;
  // tslint:disable-next-line: variable-name
  post_temp_category: string;
  // tslint:disable-next-line: variable-name
  post_temp_content: string;


  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
        this.userEmail = localStorage.getItem('userEmail');
        console.log('user email = ' + this.userEmail);
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onTextChangedTitle() {
    this.title = this.searchInput.nativeElement.value;
    this.title = this.title.toLowerCase();
  }

  onTextChangedCategory() {
    this.category = this.searchCategoryInput.nativeElement.value;
    this.category = this.category.toLowerCase();
  }

  onTextChangedDate() {
    this.date = this.searchDateInput.nativeElement.value;
  }

}
