/// <reference types="jest" />
export declare function find(selector: string | HTMLElement): HTMLElement;
export declare function content(selector: string | HTMLElement): string | null;
export declare function className(selector: string | HTMLElement): string | null;
export declare function skipButton(): HTMLElement;
export declare function nextButton(): HTMLElement;
export declare function prevButton(): HTMLElement;
export declare function doneButton(): HTMLElement;
export declare function tooltipText(): HTMLElement;
export declare function getBoundingClientRectSpy(width: number, height: number, top: number, left: number, bottom: number, right: number): jest.Mock<DOMRect, [], any>;
export declare const waitFor: (timeout: number) => Promise<unknown>;
