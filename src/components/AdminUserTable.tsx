import { Button } from '~/components/ui/Button';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/Tooltip';
import { api } from '~/utils/api';

export function AdminUserTable() {
  const userList = api.user.getUserList.useQuery().data;

  console.log('userList: ', userList);

  return (
    <div className='mt-10 overflow-y-auto'>
      <table className='w-full'>
        <thead>
          <tr className='m-0 border-t border-slate-300 p-0 even:bg-slate-100 dark:border-slate-700 dark:even:bg-slate-800'>
            <th className='border border-slate-200 p-2 text-left font-bold dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right'>
              ID
            </th>
            <th className='border border-slate-200 p-2 text-left font-bold dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right'>
              邮箱
            </th>
            <th className='border border-slate-200 p-2 text-left font-bold dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right'>
              姓名
            </th>
            <th className='border border-slate-200 p-2 text-left font-bold dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right'>
              学院
            </th>
            <th className='border border-slate-200 p-2 text-left font-bold dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right'>
              权限
            </th>
            <th className='border border-slate-200 p-2 text-left font-bold dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right'>
              状态
            </th>
            <th className='border border-slate-200 p-2 text-left font-bold dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right'>
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {userList?.map((item) => (
            <tr
              className='m-0 border-t border-slate-300 even:bg-slate-100 dark:border-slate-700 dark:even:bg-slate-800'
              key={item.id}
            >
              <td className='max-w-[120px] border border-slate-200 p-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right'>
                <Tooltip>
                  <TooltipTrigger className='inline-block w-full truncate text-left'>{item.id}</TooltipTrigger>
                  <TooltipContent>{item.id}</TooltipContent>
                </Tooltip>
              </td>
              <td className='max-w-[120px] border border-slate-200 p-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right'>
                <Tooltip>
                  <TooltipTrigger className='inline-block w-full truncate text-left'>{item.email}</TooltipTrigger>
                  <TooltipContent>{item.email}</TooltipContent>
                </Tooltip>
              </td>
              <td className='min-w-[100px] border border-slate-200 p-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right'>
                {item.name}
              </td>
              <td className='min-w-[100px] border border-slate-200 p-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right'>
                {item.college?.name || '学院未知'}
              </td>
              <td className='min-w-[100px] border border-slate-200 p-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right'>
                {item.role === 'ADMIN' ? '管理员' : '普通用户'}
              </td>
              <td className='min-w-[100px] border border-slate-200 p-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right'>
                {item.verified ? '已通过' : '未通过'}
              </td>
              <td className='min-w-[110px] border border-slate-200 p-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right'>
                {item.verified ? (
                  <Button variant='default'>关闭权限</Button>
                ) : (
                  <Button variant='default'>通过申请</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
