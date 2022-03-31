import * as React from "react";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import {ListItem, ListItemIcon, ListItemText} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import {useNavigation} from "Design/NavigationProvider";
import {useLocationPathname} from "Util/Hook/LocationPathname";
import {
  getHelloWorldPageLink,
  isHelloWorldPagePath
} from "Page/HelloWorldPage";
import {getScratchPageLink, isScratchPagePath} from "Page/ScratchPage";


export function AppDrawer(props: {
  anchor: 'left' |'right',
  open: boolean,
  toggleDrawer: (open:boolean)=>void,
}){
  const {pathname} = useLocationPathname();

  const sideList = (
    // hardcoded width reminds folks that mobile is a thing
    <div style={{width: 250}}>
      <List>
        <ListNavButton href={getHelloWorldPageLink()}
          isCurrent={isHelloWorldPagePath(pathname)}
           description={"Hello world"}
          icon={<HomeIcon/>}
        />
        <ListNavButton href={getScratchPageLink()}
          isCurrent={isScratchPagePath(pathname)}
          description="Scratch" />
        <ListNavButton href={getScratchPageLink()}
          isCurrent={isScratchPagePath(pathname)}
          description="Scratch" />
      </List>
    </div>
  );

  // const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  const onClose = ()=> props.toggleDrawer(false);
  return <SwipeableDrawer
    // disableBackdropTransition={!iOS}
    // disableDiscovery={iOS}
    open={props.open}
    onClose={onClose}
    onOpen={()=> props.toggleDrawer(true)}
    anchor={props.anchor}
  >
    <div
      tabIndex={0}
      role="button"
      onClick={onClose}
      onKeyDown={onClose}
    >
      {sideList}
    </div>
  </SwipeableDrawer>;
}

function ListNavButton(props: {
  href: string,
  description: string,
  icon?: JSX.Element,
  adminOnly?: boolean,
  isCurrent: boolean,
}){
  // const authz = useAuthz();
  const nav = useNavigation();


  // if( props.adminOnly && !authz.isAdmin() ){
  //   // if needs admin but user isn't admin, show nothing
  //   return null;
  // }

  // const isCurrent = currentScreen === props.screen;
  const {isCurrent} = props;
  const description = <span style={{fontWeight: isCurrent ? "bold":"normal"}}>
    {props.description}
  </span>;

  return <ListItem button href={props.href}
    onClick={event=>nav.navigateTo(props.href, event)}
  >
    { props.icon &&
      <ListItemIcon>
        {props.icon}
      </ListItemIcon>
    }
    <ListItemText primary={description} />
  </ListItem>;
}
