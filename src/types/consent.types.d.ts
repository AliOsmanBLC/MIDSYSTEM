export interface ConsentInfo {
    recipient: string;
    recipientType: 'PHONE' | 'EMAIL';
    status: 'APPROVE' | 'REJECT';
    type: 'MESSAGE' | 'CALL';
}
export interface UpdateConsentParams extends ConsentInfo {
    consentDate: string;
}
//# sourceMappingURL=consent.types.d.ts.map