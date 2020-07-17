import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Post } from './post.model';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({ providedIn: 'root' })
export class PostsService {
  monthString: string;
  datString: string;
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                category: post.category,
                content: post.content,
                date: post.date,
                id: post._id,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      category: string,
      content: string;
      date: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addPost(title: string, category: string, content: string) {
    const postData = new FormData();
    const date = new Date();
    console.log('full date = ' + date);
    const year = date.getFullYear();
    console.log('year = ' + year);
    const month = date.getMonth() + 1;
    console.log('month = ' + month);
    const day = date.getUTCDate();
    console.log('day = ' + day);

    if (day < 10) {
      this.datString = '0' + day;
    } else {
      this.datString = day.toString();
    }
    if (month < 10) {
      this.monthString = '0' + month;
    } else {
      this.monthString = month.toString();
    }

    const dateFormat = year.toString() + '-' + this.monthString + '-' + this.datString;
    console.log('full date = ' + dateFormat);

    postData.append('title', title);
    postData.append('category', category);
    postData.append('content', content);
    postData.append('date' , dateFormat);
    this.http
      .post<{ message: string; post: Post }>(
        BACKEND_URL,
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, category: string, content: string, date: string) {
    let postData: Post | FormData ;
    postData = {
        id,
        title,
        category,
        date,
        content,
        creator: null
      };
    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }

}
