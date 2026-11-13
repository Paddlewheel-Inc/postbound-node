const dotSegment = /^\.{1,2}$/;

export function hasDotSegment(requestPath: string): boolean {
  const [pathname] = requestPath.split('?');
  return pathname.split('/').some((segment) => dotSegment.test(segment));
}
