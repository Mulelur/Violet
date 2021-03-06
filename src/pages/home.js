import * as React from "react";
import { useStoreState, useStoreActions } from "easy-peasy";
import { Helmet } from "react-helmet-async";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import HomeDialog from "../container/home/Home";
import NavBarContainer from "../container/navBar";
import AboutMeDialog from "../container/aboutMe/aboutMeDialog";
import ContactDialog from "../container/contact/contactDialog";
import SavePage from "../components/savePage";
import { useQuery } from "@apollo/client";
import SITE from "../graphQL/ouerys/siteQuery";
import Loading from "../components/loading";

export default function Home() {
  const [open, setOpen] = React.useState(false);

  const { loading, error, data } = useQuery(SITE, {
    variables: {
      id: 1,
    },
  });

  const dialogs = useStoreState((state) => state.dialogs);

  const site = useStoreState((state) => state.site);

  const setDialog = useStoreActions((actions) => actions.setDialog);

  const setSite = useStoreActions((actions) => actions.setSite);

  const setPages = useStoreActions((actions) => actions.setPages);

  React.useLayoutEffect(() => {
    if (!loading && !error) {
      setPages(data.site.data.attributes.template.data.attributes.pages);

      setSite(data.site.data.attributes);
    }
  }, [loading]);

  if (loading)
    return (
      <>
        <Loading />
      </>
    );

  if (error) return <>{`Error! ${error.message}`}</>;

  const handleClickOpen = (id) => {
    setDialog({ id, open: true });
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpen(open);
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {dialogs.map((item, index) => (
          <ListItem button key={item.id}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText
              onClick={() => handleClickOpen(item.id)}
              primary={item.name}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const anchor = "right";

  return (
    <>
      <Helmet>
        <title>Weblinnk - {site.siteName}</title>
        <meta
          name="description"
          content="A React Boilerplate application homepage"
        />
      </Helmet>
      <div
        style={{
          backgroundColor: "#161C2D",
        }}
      >
        <NavBarContainer setOpen={setOpen} />
        <HomeDialog />
        <AboutMeDialog />
        <ContactDialog />
        <SavePage />
        <Drawer
          anchor={anchor}
          open={open}
          onClose={toggleDrawer(anchor, false)}
        >
          {list(anchor)}
        </Drawer>
      </div>
    </>
  );
}
