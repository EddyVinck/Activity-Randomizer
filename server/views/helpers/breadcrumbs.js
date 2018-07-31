const getBreadcrumbs = () => {
  const fakeBreadcrumbs = ['path', 'to', 'page'];
  let breadCrumbList = '<ol>';

  fakeBreadcrumbs.forEach((crumb) => {
    breadCrumbList += `<li><a href="/">${crumb}</a></li>`;
  });

  return breadCrumbList;
};

export default getBreadcrumbs;
