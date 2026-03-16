export function Injectable(_opts?: any): ClassDecorator {
  return (_target: any) => {};
}

export function Component(_opts?: any): ClassDecorator {
  return (_target: any) => {};
}

export interface OnInit {
  ngOnInit(): void;
}
