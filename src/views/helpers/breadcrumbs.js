const getBreadcrumbs = (req, res, next) => {
  const fakeBreadcrumbs = ['path', 'to', 'page'];
  let breadCrumbList = "<ol>"

  fakeBreadcrumbs.forEach(crumb => {
    breadCrumbList += `<li><a href="/">${crumb}</a></li>`;
  });

  return breadCrumbList;
}

module.exports = getBreadcrumbs;