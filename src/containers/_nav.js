export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavTitle',
        _children: ['Management']
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Roles',
        to: '/management/roles',
        icon: 'cil-drop'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Users',
        to: '/management/users',
        icon: 'cil-pencil'
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Akasya Durağı']
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Akasya Durağı',
        route: '/akasya_duragi',
        icon: 'cil-puzzle',
        items: [
          {
            name: 'Stations',
            to: '/akasya_duragi/stations'
          },
          {
            name: 'Workers',
            to: '/akasya_duragi/workers'
          },
          {
            name: 'Taxis',
            to: '/akasya_duragi/taxis'
          },
          {
            name: 'Voyages',
            to: '/akasya_duragi/voyages'
          }
        ]
      }
    ]
  }
]