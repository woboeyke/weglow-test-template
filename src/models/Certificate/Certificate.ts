export interface Certificate {
  orderId: string;
  email: string;
  naam: string;
  voornaam: string;
  rijksregisternummer: string;
  adres: string;
  bedrag: number;
  datum: string;
  status: CertificateStatus;
}

export enum CertificateStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export const defaultCertificate: Certificate = {
  orderId: '',
  email: '',
  naam: '',
  voornaam: '',
  rijksregisternummer: '',
  adres: '',
  bedrag: 0,
  datum: new Date().toISOString(),
  status: CertificateStatus.Pending,
};
