export interface PhoneContact {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneNumbers: { number: string }[];
  image: any;
  imageAvailable: boolean;
  recordID: string;
}
