
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt?: Date;
}

export interface UserDocument {
    _id?: any;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}
