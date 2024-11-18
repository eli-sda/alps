import React from "react";
import useResponsiveStyles from "../../../helpers/useResponsiveStyles";
import { InlineStyles } from "../../../helpers/InlineStyles";
import { SourceSet } from "../../../atoms/images/SourceSet";

const getBackgroundRule = (url: string) => `.o-background-image {
  background-image: url("${url}");
}`;

export interface PageHeaderProps {
  background?: SourceSet;
  /**
   * Specify the kicker of your PageHeader
   */
  kicker?: string;
  /**
   * Specify the title of your PageHeader
   */
  title?: string;
  /**
   * Specify the url of your PageHeader
   */
  url?: string;
}

export const PageHeader = ({
  title,
  kicker,
  background,
  url,
}: PageHeaderProps): JSX.Element => {
  const bgInlineStyles = useResponsiveStyles(getBackgroundRule, background);

  const backgroundClass = background
    ? "o-background-image u-background--cover u-gradient--bottom"
    : "";

  return (
    <header className={`c-page-header c-page-header__simple ${backgroundClass} u-theme--background-color--dark`}>
      {bgInlineStyles && <InlineStyles styles={bgInlineStyles} />}
      <div className="c-page-header__simple--inner u-padding">
        {kicker && <span className="o-kicker u-color--white">{kicker}</span>}
        <h1 className="u-color--white u-font--primary--xxl">
          {url ? (
            <a href={url} className={"u-link--white u-link-hover--white"}>
              {title}
            </a>
          ) : (
            <>{title}</>
          )}
        </h1>
      </div>
    </header>
  );
};
