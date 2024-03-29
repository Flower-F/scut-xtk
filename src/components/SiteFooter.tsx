export function SiteFooter() {
  return (
    <footer className='container'>
      <div className='flex flex-col items-center justify-between gap-4 border-t border-t-slate-200 py-10 dark:border-t-slate-700 md:h-24 md:flex-row md:py-0'>
        <div className='flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0'>
          <div className='flex space-x-4 text-center text-sm leading-loose text-slate-600 dark:text-slate-400 md:text-left'>
            <div>相关链接</div>

            <a
              href='http://eonline.jw.scut.edu.cn/'
              target='_blank'
              rel='noreferrer'
              className='font-medium underline underline-offset-4'
            >
              教学在线
            </a>

            <a
              href='https://webmail.scut.edu.cn/'
              target='_blank'
              rel='noreferrer'
              className='font-medium underline underline-offset-4'
            >
              邮箱
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
