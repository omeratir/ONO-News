import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CategoryCreateComponent } from './category-create/category-create.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { AngularMaterialModule } from '../angular-material.module';

import {MatGridListModule} from '@angular/material/grid-list';

@NgModule({
  declarations: [CategoryCreateComponent, CategoryListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    MatGridListModule,
  ]
})
export class CategoriesModule {}
