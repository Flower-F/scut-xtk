import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/Sheet';

export function PaperSheet() {
  return (
    <Sheet>
      <SheetTrigger className='fixed right-0 top-1/2 hidden rounded-l-lg border-2 border-r-0 bg-white px-1 py-4 text-xs shadow-md hover:scale-105 dark:bg-slate-900 sm:block'>
        试题篮
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>当前试题集</SheetTitle>
          {/* <SheetDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </SheetDescription> */}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
