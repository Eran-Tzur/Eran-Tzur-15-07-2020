import { trigger, transition, animate, style } from '@angular/animations';

export const fade = trigger('fade', [
  transition('void => *', [
    style({ opacity: 0 }),
    animate(1000)
  ])
])

