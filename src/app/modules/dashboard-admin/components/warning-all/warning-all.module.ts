import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { WarningALLComponent } from './warning-all.component';



@NgModule({
  declarations: [WarningALLComponent],
  imports: [
    CommonModule,
    MatProgressBarModule,
    FormsModule
  ],

  exports:[WarningALLComponent]
})
export class WarningALLModule { }
