import { cn } from "../utils/cn";

const Button = () => {
  // w-100 대신 w-32(확실한 규격), bg-red-500(눈에 띄는 색)
  return (
    <div className={cn("bg-red-500 w-32 h-10 text-white flex items-center justify-center")}>
      버튼
    </div>
  );
};

export default Button;
