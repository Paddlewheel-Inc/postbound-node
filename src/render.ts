export async function render(node: React.ReactNode) {
  let renderComponent: typeof import('@react-email/render').render;

  try {
    ({ render: renderComponent } = await import('@react-email/render'));
  } catch {
    throw new Error(
      'Failed to render React component. Make sure to install `@react-email/render` or `@react-email/components`.',
    );
  }

  return renderComponent(node);
}
