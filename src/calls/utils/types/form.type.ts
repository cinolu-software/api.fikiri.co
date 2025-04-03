export interface IForm {
  phase: string;
  fields: IField[];
}

export interface IField {
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  options?: IOption[];
  required?: boolean;
}

export interface IOption {
  label: string;
  value: string;
}
