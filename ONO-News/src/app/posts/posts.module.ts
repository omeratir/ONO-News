import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { AngularMaterialModule } from '../angular-material.module';

import {MatGridListModule} from '@angular/material/grid-list';
import { SearchPipe } from './post-list/search.pipe';
import { SearchCategoryPipe } from './post-list/searchcategory.pipe';
import { SearchDatePipe } from './post-list/searchdate.pipe';

@NgModule({
  declarations: [PostCreateComponent, PostListComponent, SearchPipe, SearchCategoryPipe, SearchDatePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    MatGridListModule,
  ]
})
export class PostsModule {}
