import * as React from "react";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import {ListItem, ListItemIcon, ListItemText} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import {useNavigation} from "Design/NavigationProvider";
import {useLocationPathname} from "Util/Hook/LocationPathname";
import { getListUserPageLink, isListUserPagePath } from "Page/ListUserPage";
import { People } from "@mui/icons-material";
import { getMyDetailsPageLink, isMyDetailsPagePath } from "Page/MyDetailsPage";


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
        <ListNavButton href={getMyDetailsPageLink()}
          isCurrent={isMyDetailsPagePath(pathname)}
           description={"My details"}
          icon={<HomeIcon/>}
        />
        <ListNavButton href={getListUserPageLink()}
          isCurrent={isListUserPagePath(pathname)}
          description="List users" 
          icon={<People/>}/>
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
