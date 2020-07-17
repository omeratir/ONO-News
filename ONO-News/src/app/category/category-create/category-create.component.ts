import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { Category } from '../category.model';
import { AuthService } from '../../auth/auth.service';
import { CategoriesService } from '../categories.service';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css']
})

export class CategoryCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  category: Category;
  isLoading = false;
  form: FormGroup;
  private mode = 'createcategory';
  private categoryId: string;
  private authStatusSub: Subscription;

  constructor(
    public citiesService: CategoriesService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('categoryId')) {
        this.mode = 'categoryedit';
        this.categoryId = paramMap.get('categoryId');
        this.isLoading = true;
        this.citiesService.getCategory(this.categoryId).subscribe(categoryData => {
          this.isLoading = false;
          this.category = {
            id: categoryData._id,
            name: categoryData.name,
            creator: categoryData.creator
          };
          this.form.setValue({
            name: this.category.name
          });
        });
      } else {
        this.mode = 'createcategory';
        this.categoryId = null;
      }
    });
  }

  onSaveCategory() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'createcategory') {
      this.citiesService.addCategory(
        this.form.value.name
      );
    } else {
      this.citiesService.updateCategory(
        this.categoryId,
        this.form.value.name
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
