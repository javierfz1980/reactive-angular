export interface RouteElement {
  path: string;
  icon?: string;
  label?: string;
  childs?: {[key:string]: RouteElement};
}

