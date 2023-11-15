export function delayBy(delayMs: number) {
  return new Promise<void>(resolve => setTimeout(resolve, delayMs));
}

export function firePointerEvent(selector: string, eventType: 'pointerup' | 'click') {
  getElementBySelector(selector).dispatchEvent(new CustomEvent(eventType));
}

export function extractTextContent(selector: string) {
  const textContent = getElementBySelector(selector).textContent;

  if (textContent !== null) {
    return textContent;
  }

  throw new Error(
    // eslint-disable-next-line max-len
    `Text content of element with selector '${selector}' is null, ensure that the target element is neither a document nor a doctype`
  );
}

export function getElementBySelector(selector: string) {
  const element = document.body.querySelector(selector);

  if (element === null) {
    throw new Error(`No element with select '${selector}' was found`);
  }

  return element as HTMLElement;
}

export function findElementBySelector(selector: string) {
  return document.body.querySelector(selector);
}
