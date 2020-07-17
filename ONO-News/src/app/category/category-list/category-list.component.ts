import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Category } from '../category.model';
import { CategoriesService } from '../categories.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-city-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit, OnDestroy {

  categories: Category[] = [

  ];

  isLoading = false;
  totalcategories = 0;
  categoriesPerPage = 10;
  categorieslength = 1;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private categoriesSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public categoriesService: CategoriesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.categoriesService.getCategories(this.categoriesPerPage, this.currentPage);
    this.userId = this.authService.getUserId();

    this.categoriesService.getCategories(this.categoriesPerPage, this.currentPage);
    this.categoriesSub = this.categoriesService
        .getCategoryUpdateListener()
        .subscribe((postData: { categories: Category[]; categoryCount: number }) => {
          this.isLoading = false;
          this.totalcategories = postData.categoryCount;
          this.categories = postData.categories;
        });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.categoriesPerPage = pageData.pageSize;
    this.categoriesService.getCategories(this.categoriesPerPage, this.currentPage);
  }

  onDelete(categoryId: string) {
    this.isLoading = true;
    this.categoriesService.deleteCategory(categoryId).subscribe(() => {
      this.categoriesService.getCategories(this.categoriesPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.categoriesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
