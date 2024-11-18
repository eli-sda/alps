import React from "react";

import { IconWrap } from "../../../atoms/icons/IconWrap";
import renderItems from "../../../helpers/renderItems";
import { NavLink } from "react-router-dom";

export interface BreadcrumbItemProps {
  text: string;
  url?: string;
  useNavLink?: boolean;
}

export const BreadcrumbItem = ({
  text,
  url,
  useNavLink = false,
}: BreadcrumbItemProps): JSX.Element => {
  return (
    <li
      className={`c-breadcrumbs__list-item  u-font--secondary--s u-text-transform--upper u-display--inline-block ${
        url ? "u-color--gray" : "u-theme--color--base"
      }`}
    >
      <IconWrap name="arrow-bracket-right" size="xs" color={"gray"} />
      <strong>
        {url ? (
          useNavLink ? (
            <NavLink className="c-breadcrumbs__link can-be--white" to={url}>
              {text}
            </NavLink>
          ) : (
            <a className="c-breadcrumbs__link can-be--white" href={url}>
              {text}
            </a>
          )
        ) : (
          text
        )}
      </strong>
    </li>
  );
};

export interface BreadcrumbsProps {
  items?: BreadcrumbItemProps[];
}

export const Breadcrumbs = ({ items = [] }: BreadcrumbsProps): JSX.Element => {
  return (
    <>
      {
      items.length > 0 && (
        <nav className="c-breadcrumbs" role="navigation">
          <ul className="c-breadcrumbs__list">
            {renderItems(items, BreadcrumbItem, "")}
          </ul>
        </nav>
      )
      }
    </>
  );
};
