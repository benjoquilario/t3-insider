import React from "react";

const MenuProfile = React.forwardRef(() => {
  return (
    <div ref={ref} className="flex items-center justify-end">
      <div className="flex items-center justify-center gap-1">
        {isLoading ? (
          <div className="h-12 w-12 animate-pulse rounded-full border border-zinc-200 bg-zinc-100" />
        ) : (
          <Button
            onClick={toggleDropDown}
            className="w-18 flex h-14 items-center justify-center rounded-full hover:opacity-90"
            aria-label="dropdown profile"
          >
            <div
              className={classNames(
                "transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            >
              <IoMdArrowDropdown aria-hidden="true" size={20} />
            </div>
            <Image
              className="rounded-full"
              src={auth?.image || "/default-image.png"}
              alt={auth?.name || ""}
              layout="fill"
              containerclassnames="relative h-[48px] w-[48px]"
            />
          </Button>
        )}
        {isOpen && <Dropdown />}
      </div>
    </div>
  );
});

export default MenuProfile;
