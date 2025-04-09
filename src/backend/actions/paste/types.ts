export enum PasteVisibility {
  Public,
  ResidentsOnly
}

export enum PasteExpiration {
  AfterFirstRead = 'after-first-read',
  FifteenMinutes = '15m',
  Never = 'never',
  OneDay = '24h',
  OneHour = '1h',
  OneWeek = '168h'
}

export interface SerialisedPasteMetadata {
  createdAt: string;
  createdBy: string;
  expiration: PasteExpiration;
  metadata: {
    isEncrypted: boolean;
    syntaxLanguage: string;
  }
  visibility: PasteVisibility;
}
