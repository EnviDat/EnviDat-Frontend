export type S3Node = {
  id?: number;
  title: string;
  isFile: boolean;
  isChild: boolean;
  isLastItem?: boolean;
  isLoaded?: boolean;
  link?: string;
  numberOfChildren?: number;
  childrenLoaded: boolean;
  children: S3Node[] | undefined;
};
