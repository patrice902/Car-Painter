import {
  Avatar,
  Box,
  Button,
  Divider,
  Link as MuiLink,
  Popover,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { useFeatureFlag } from "configcat-react";
import React, {
  MouseEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PaintBuilderLogo from "src/assets/paint-builder-logo.svg";
import TradingPaintsLogo from "src/assets/trading-paints-logo.svg";
import { decodeHtml, getAvatarURL, getUserName } from "src/helper";
import { RootState } from "src/redux";
import { signOut } from "src/redux/reducers/authReducer";
import { ConfigCatFlags } from "src/types/enum";
import styled from "styled-components";

type AppHeaderProps = {
  isBoard?: boolean;
  children?: ReactNode;
  onBack?: (goParent?: boolean) => void;
};

export const AppHeader = React.memo(
  ({ isBoard, children, onBack }: AppHeaderProps) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.authReducer.user);
    const saving = useSelector(
      (state: RootState) => state.schemeReducer.saving
    );
    const { value: helpLinkMenu } = useFeatureFlag(
      ConfigCatFlags.HELP_LINK_MENU,
      ""
    );

    const [
      profileAnchorEl,
      setProfileAnchorEl,
    ] = useState<HTMLButtonElement | null>(null);
    const isAboveMobile = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up("sm")
    );
    const isAdmin = useMemo(() => Boolean(user?.is_admin), [user]);

    const handleSignOut = useCallback(() => {
      dispatch(signOut());
    }, [dispatch]);

    const handleBack = useCallback(
      (e: MouseEvent<HTMLAnchorElement>) => {
        if (onBack) {
          e.preventDefault();
          if (!saving) {
            onBack?.(true);
          }
        }
      },
      [onBack, saving]
    );

    return (
      <Wrapper
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="8px 15px"
        bgcolor="black"
      >
        {isAboveMobile || !isBoard ? (
          <Box
            height="30px"
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
          >
            <MuiLink
              href="https://tradingpaints.com/"
              style={{ height: "30px" }}
            >
              <img
                src={TradingPaintsLogo}
                alt="TradingPaintsLogo"
                height="100%"
              />
            </MuiLink>
            <SlashSeparator>&#47;</SlashSeparator>
            <Link onClick={handleBack} to="/" style={{ height: "30px" }}>
              <img
                src={PaintBuilderLogo}
                alt="PaintBuilderLogo"
                height="100%"
              />
            </Link>
          </Box>
        ) : (
          <></>
        )}
        <Box
          height="100%"
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent={
            isAboveMobile || !isBoard ? "flex-end" : "space-around"
          }
        >
          {children}
          {user && (isAboveMobile || !isBoard) ? (
            <>
              <Box marginLeft="8px">
                <AvatarButton
                  onClick={(event) => setProfileAnchorEl(event.currentTarget)}
                >
                  <Avatar alt={getUserName(user)} src={getAvatarURL(user.id)}>
                    {user.drivername[0].toUpperCase()}
                  </Avatar>
                </AvatarButton>
              </Box>

              <Popover
                open={Boolean(profileAnchorEl)}
                anchorEl={profileAnchorEl}
                onClose={() => setProfileAnchorEl(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Box py={2} display="flex" flexDirection="column">
                  <NameItem>{decodeHtml(getUserName(user))}</NameItem>
                  {isAdmin ? (
                    <StyledLink as={Link} to="/admin">
                      Admin Panel
                    </StyledLink>
                  ) : (
                    <></>
                  )}
                  <StyledLink
                    href="https://tradingpaints.com/messages"
                    target="_blank"
                  >
                    Messages
                  </StyledLink>
                  <StyledLink
                    href="https://tradingpaints.com/user/settings"
                    target="_blank"
                  >
                    Settings
                  </StyledLink>
                  {isAboveMobile ? (
                    <StyledLink
                      href="https://tradingpaints.com/install"
                      target="_blank"
                    >
                      Install Downloader
                    </StyledLink>
                  ) : (
                    <></>
                  )}
                  <StyledLink href={helpLinkMenu} target="_blank">
                    Help
                  </StyledLink>
                  <StyledDivider />
                  <SignOutButton onClick={handleSignOut}>
                    Sign out
                  </SignOutButton>
                </Box>
              </Popover>
            </>
          ) : (
            <></>
          )}
        </Box>
      </Wrapper>
    );
  }
);

export const SlashSeparator = styled(Typography)`
  color: #666;
  font-size: 40px;
  font-weight: 400;
  margin: 2px 5px 0;
`;

const StyledLink = styled(MuiLink)`
  font-size: 13px;
  font-family: CircularXXWeb-Regular;
  font-weight: 500;
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  &:hover {
    text-decoration: none;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const StyledDivider = styled(Divider)`
  margin: 8px 0;
`;

const SignOutButton = styled(Button)`
  padding: 8px 16px;
  justify-content: start;
  line-height: 1;
`;

const NameItem = styled(Typography)`
  font-size: 13px;
  font-family: AkkuratMonoLLWeb-Regular;
  font-weight: 500;
  color: lightgray;
  padding: 8px 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const AvatarButton = styled(Button)`
  width: 40px;
  min-width: 40px;
  height: 40px;
  padding: 0;
`;

const Wrapper = styled(Box)`
  gap: 16px;
`;

export default AppHeader;
