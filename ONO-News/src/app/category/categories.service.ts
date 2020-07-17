import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Category } from './category.model';

const BACKEND_URL = environment.apiUrl + '/categories/';

@Injectable({ providedIn: 'root' })
export class CategoriesService {

  private categories: Category[] = [];
  private categoryUpdated = new Subject<{ categories: Category[]; categoryCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getCategories(categoriesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${categoriesPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; categories: any; maxCategories: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(postData => {
          return {
            categories: postData.categories.map(post => {
              return {
                name: post.name,
                id: post._id,
                creator: post.creator
              };
            }),
            maxCategories: postData.maxCategories
          };
        })
      )
      .subscribe(transformedPostData => {
        this.categories = transformedPostData.categories;
        this.categoryUpdated.next({
          categories: [...this.categories],
          categoryCount: transformedPostData.maxCategories
        });
      });
  }

  getCategoryUpdateListener() {
    return this.categoryUpdated.asObservable();
  }

  getCategory(id: string) {
    return this.http.get<{
      _id: string;
      name: string,
      creator: string;
    }>(BACKEND_URL + id);
  }

  addCategory(name: string) {
    const CategoryData = new FormData();
    CategoryData.append('name', name);
    this.http
      .post<{ message: string; category: Category }>(
        BACKEND_URL,
        CategoryData
      )
      .subscribe(responseData => {
        this.router.navigate(['/categorylist']);
      });
  }

  updateCategory(id: string, name: string) {
    let CategoryData: Category | FormData;
    CategoryData = new FormData();
    CategoryData.append('name', name);

    this.http
      .put(BACKEND_URL + id, CategoryData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deleteCategory(CategoryId: string) {
    return this.http.delete(BACKEND_URL + CategoryId);
  }
}
