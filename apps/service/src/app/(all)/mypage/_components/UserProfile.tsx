import { Button } from '@repo/ui';

const UserProfile = () => {
  return (
    <div className="flex w-full flex-col items-end rounded-lg bg-gray-100 p-4 shadow-[0_5px_15px_0px_rgba(0,0,0,0.1)]">
      <div className="flex w-full gap-5">
        {/* API연동시 이미지 태그추가 */}
        <div className="bg-primary-100 h-12.5 w-12.5 shrink-0 rounded-full"></div>
        <div className="flex w-full flex-col">
          <div className="flex w-full justify-between">
            <span className="title3">유저닉네임</span>
            <Button size={'sm'} variant={'noneline'}>
              수정
            </Button>
          </div>
          <div>
            <span className="body3 text-gray-700">example@gmail.com</span>
          </div>
        </div>
      </div>
      <Button size={'sm'} variant={'noneline'}>
        로그아웃
      </Button>
    </div>
  );
};

export default UserProfile;
