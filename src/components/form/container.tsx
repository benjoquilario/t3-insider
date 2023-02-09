import React from "react";

type FormContainerProps = {
  type: string;
  title: string;
  children: React.ReactNode;
};

const FormContainer: React.FC<FormContainerProps> = ({
  type,
  title,
  children,
}) => {
  return (
    <div className="flex h-full min-h-screen w-full items-center justify-center">
      <div className="md:min-h-auto mx-auto mt-0 flex min-h-[430px] w-4/5 max-w-full flex-col items-center justify-center rounded-md bg-white py-[20px] px-[24px] text-center shadow-md md:w-full md:max-w-[400px] md:px-[40px]">
        <h1 className="mt-[13px] mb-[20px] text-2xl font-semibold text-zinc-900">
          <div className="flex flex-col ">
            <span className="text-base font-light tracking-tight">{title}</span>
            <span className="text-lg font-normal tracking-wide">{type}</span>
          </div>
        </h1>
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
