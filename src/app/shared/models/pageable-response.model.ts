export class PageableResponse<T> {
    public content: T[];
    public totalElements: Number;
    public last: boolean;
    public totalPages: Number;
    public size: Number;
    public number: Number;
    public sort: PageableSort[];
    public first: boolean;
    public numberOfElements: Number;
}

export class PageableSort {
    public direction: String;
    public property: String;
    public ignoreCase: boolean;
    public nullHandling: String;
    public ascending: boolean;
    public descending: boolean;
}