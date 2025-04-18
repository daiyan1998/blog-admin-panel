import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/blogs/components/data-table')(
  {
    component: () => <div>Hello /_dashboard/blogs/components/data-table!</div>,
  },
)
