import { useSize } from "ahooks";
import { useAtom } from "jotai";
import { merge } from "lodash-es";
import { CSSProperties, useCallback, useEffect, useRef } from "react";
import { atomIsDrawerOnlyIcon } from "@/store";
import getSystem from "@/utils/get-system";
import { languageQuirks } from "@/utils/language";
import { getRoutesWithIcon } from "@/utils/routes-utils";
import { useNyanpasu } from "@nyanpasu/interface";
import { cn } from "@nyanpasu/ui";
import AnimatedLogo from "../layout/animated-logo";
import RouteListItem from "./modules/route-list-item";

export const DrawerContent = ({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) => {
  const [onlyIcon, setOnlyIcon] = useAtom(atomIsDrawerOnlyIcon);

  const { nyanpasuConfig } = useNyanpasu();

  const routes = getRoutesWithIcon();

  const contentRef = useRef<HTMLDivElement | null>(null);

  const size = useSize(contentRef);

  const handleResize = useCallback(
    (value?: number) => {
      if (value) {
        if (
          value <
          languageQuirks[nyanpasuConfig?.language ?? "en"].drawer.minWidth
        ) {
          setOnlyIcon(true);
        } else {
          setOnlyIcon(false);
        }
      } else {
        setOnlyIcon(false);
      }
    },
    [nyanpasuConfig?.language, setOnlyIcon],
  );

  useEffect(() => {
    handleResize(size?.width);
  }, [handleResize, size?.width]);

  return (
    <div
      ref={contentRef}
      className={cn(
        "p-4",
        getSystem() === "macos" ? "pt-14" : "pt-8",
        "w-full",
        "h-full",
        "flex",
        "flex-col",
        "gap-4",
        className,
      )}
      style={merge(
        {
          backgroundColor: "var(--background-color-alpha)",
        },
        style,
      )}
      data-windrag
    >
      <div className="mx-2 flex items-center justify-center gap-4">
        <div className="h-full max-h-28 max-w-28" data-windrag>
          <AnimatedLogo className="h-full w-full" data-windrag />
        </div>

        {!onlyIcon && (
          <div
            className="mr-1 mt-1 whitespace-pre-wrap text-lg font-bold"
            data-windrag
          >
            {"Clash\nNyanpasu"}
          </div>
        )}
      </div>

      <div className="scrollbar-hidden flex flex-col gap-2 overflow-y-auto !overflow-x-hidden">
        {Object.entries(routes).map(([name, { path, icon }]) => {
          return (
            <RouteListItem
              key={name}
              name={name}
              path={path}
              icon={icon}
              onlyIcon={onlyIcon}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DrawerContent;
