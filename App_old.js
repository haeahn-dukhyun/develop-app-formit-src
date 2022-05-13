import React, { Component } from "react";
import Project from "./components/Project";
import "./App.css";
import { createTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { withStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import CustomerAdd from "./components/CustomerAdd";
import Layer from "./components/Layer";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { purple } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import {
  FormIt,
  WSM,
} from "https://formit3d.github.io/SharedPluginUtilities/FormIt.mod.js";
import { DataGrid } from "@mui/x-data-grid";
import DataTable from "./components/DataTable";
import { circularProgressClasses } from "@mui/material";

const th = createTheme({
  status: {},
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: purple[500],
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#11cb5f",
    },
  },
});

const styles = (theme) => ({
  root: {
    width: "100%",
    //minWidth: 1080,
  },
  menu: {
    marginTop: 15,
    marginBottom: 15,
    display: "flex",
    justifyContent: "center",
  },
  paper: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  progress: {
    margin: th.spacing.unit * 2,
  },
  grow: {
    flexGrow: 1,
  },
  tableHead: {
    fontSize: "1.0rem",
  },
  menuButton: {
    marginLeft: 0,
    marginRight: 20,
  },
  title: {
    display: "none",
    [th.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  subtitle: {
    fontSize: "1.0rem",
    marginLeft: 10,
  },
  search: {
    position: "relative",
    borderRadius: th.shape.borderRadius,
    //backgroundColor: fade(th.palette.primary.main, 0.15),
    //"&:hover": {
    //  backgroundColor: fade(th.palette.common.white, 0.25),
    //},
    marginLeft: 0,
    width: "100%",
    [th.breakpoints.up("sm")]: {
      marginLeft: th.spacing.unit,
      width: "auto",
    },
  },
  searchIcon: {
    width: th.spacing.unit * 9,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  inputInput: {
    paddingTop: th.spacing.unit,
    paddingRight: th.spacing.unit,
    paddingBottom: th.spacing.unit,
    paddingLeft: th.spacing.unit * 10,
    //transition: theme.transitions.create(["background-color", "transform"], {
    //  duration: theme.transitions.duration.standard,
    //}),
    width: "100%",
    [th.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200,
      },
    },
  },
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: "",
      completed: 0,
      searchKeyword: "",
      projectInfo: [],
      currentId: "",
      x: 0,
      y: 0,
      rowsGrid0: [],
      rowsGrid1: [],
      rowsLayer: [],
    };
    this.stateRefresh = this.stateRefresh.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleCreateBlock = this.handleCreateBlock.bind(this);
    this.handleGetLayer = this.handleGetLayer.bind(this);
    this.handleGetArea = this.handleGetArea.bind(this);
    this.handleGetAreaPerDong = this.handleGetAreaPerDong.bind(this);
  }

  handleValueChange(e) {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  stateRefresh() {
    this.setState({
      projects: "",
      completed: 0,
      searchKeyword: "",
    });
    this.callApi("/api/projects")
      .then((res) => this.setState({ projects: res }))
      .catch((err) => console.log(err));
  }

  componentDidMount() {
    //this.timer = setInterval(this.progress, 20);
    this.callApi("/api/projects")
      .then((res) => this.setState({ projects: res }))
      .catch((err) => console.log(err));
  }

  componentWillUnmount() {
    //console.log("componentWillUnmount");
    clearInterval(this.timer);
  }

  callApi = async (api) => {
    const response = await fetch(api);
    const body = await response.json();
    return body;
  };

  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 1 });
  };

  informationComponents = (data) => {
    console.log("informationComponents = (data) => { : ", data);
    return data.map((c) => {
      return (
        <div key={c.ID}>
          <Grid container spacing={1}>
            <Grid item style={{ width: "150px" }}>
              <Item>지번</Item>
            </Grid>
            <Grid item xs>
              <Item>project info : {c.ID}</Item>
            </Grid>
          </Grid>
        </div>
      );
    });
  };

  handleClick = (e, id, name) => {
    e.preventDefault();

    //this.setState({ currentId: id });
    console.log("handleClick = (e, id, name)", id);

    let _projectinfo = [];

    this.callApi("/api/projects/info/" + id)
      .then((res) => {
        let keys = Object.keys(res[0]);
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          _projectinfo.push(
            <div key={i}>
              <Grid container spacing={1}>
                <Grid item style={{ width: "150px" }}>
                  <Item>{key}</Item>
                </Grid>
                <Grid item xs>
                  <Item>{res[0][key]}</Item>
                </Grid>
              </Grid>
            </div>
          );
        }
      })
      .catch((err) => console.log(err));

    // this.setState({
    //   projectInfo: _projectinfo,
    // });

    this.setState({ projectInfo: _projectinfo.map((row) => ({ ...row })) });
  };

  async handleCreateBlock(e) {
    console.log("handleTest: ", e.target);
    console.log("async createBlock(): ", this.state.x);
    const w = this.state.x + 30,
      h = this.state.y + 20,
      l = 60;
    const pt1 = WSM.Geom.Point3d(this.state.x, this.state.y, 0);
    const pt2 = WSM.Geom.Point3d(w, h, l);
    const histID = await FormIt.GroupEdit.GetEditingHistoryID();
    const blockID = await WSM.APICreateBlock(histID, await pt1, await pt2);

    console.log("createBlock(): histID: ", histID);
    console.log("createBlock(): blockID: ", blockID);

    this.setState({
      x: w,
      y: h,
    });
  }

  doSomething(id) {
    return new Promise((resolve, reject) => {
      console.log(id);
      console.log(resolve);
      console.log(reject);
    });
  }

  convertUnit = (val, unit) => {
    let val2 = 0;
    if (unit === 0) {
      console.log(unit);
      val2 = 1;
    } else if (unit === 1) {
      console.log(unit);
      val2 = 0.09290304;
    } else if (unit === 2) {
      console.log(unit);
      val2 = 12;
    } else if (unit === 3) {
      console.log(unit);
      val2 = 0.09290304;
    } else if (unit === 4) {
      console.log(unit);
      val2 = 0.09290304;
    }

    // let a = FormIt.UnitType.kImperialFeetInches;
    // let b = FormIt.UnitType.kMetricMeter;
    // let c = FormIt.UnitType.kImperialInches;
    // let d = FormIt.UnitType.kMetricCentimeter;
    // let e = FormIt.UnitType.kMetricMillimeter;
    // console.log(a, b, c, d, e);

    return val * val2;
  };

  handleGetLayer(e) {
    e.preventDefault();

    //this.setState({ currentId: id });
    //console.log(this.state.currentId);

    let rows = [];

    this.callApi("/api/layer")
      .then((res) => this.setState({ rowsLayer: res }))
      .catch((err) => console.log(err));

    //this.setState({ rowsLayer: rows });

    console.log("handleGetLayer(e)", this.state.rowsLayer);
  }

  // 용도별 면적표
  async handleGetArea(e) {
    console.log("handleGetArea: start: ");

    let selection = await FormIt.Selection.GetSelections();

    let history = 0;

    let allBody = await WSM.APIGetAllObjectsByTypeReadOnly(history, 1); // 1=nBodyType
    //console.log("allBody", allBody);

    let buildings = [];
    for (var i = 0; i < allBody.length; i++) {
      let curId = allBody[i];

      let layerId = await WSM.APIGetObjectLayersReadOnly(history, curId);
      console.log("layerObj", layerId[0]);

      let layerData = await WSM.APIGetLayerDataReadOnly(history, layerId[0]);
      console.log("layerData", layerData);

      var objectProps = await WSM.APIGetObjectPropertiesReadOnly(
        history,
        curId
      );

      var objectLevels = await WSM.APIGetObjectLevelsReadOnly(history, curId);

      let sumArea = 0;
      for (var j = 0; j < objectLevels.length; j++) {
        let curLevelId = objectLevels[j];
        let area = await FormIt.Levels.GetAreaForObjects(
          history,
          curLevelId,
          curId
        );

        let levelData = await WSM.APIGetLevelDataReadOnly(history, curLevelId);
        if (levelData.dElevation < 0) {
          continue;
        }

        console.log("levelData", levelData);

        sumArea =
          sumArea + this.convertUnit(area, FormIt.UnitType.kMetricMeter);
        sumArea = Number(sumArea.toFixed(2));
      }

      sumArea = Number(sumArea.toFixed(2));

      buildings.push({
        id: curId,
        col1: layerData.name,
        col2: objectProps.sObjectName,
        col3: objectLevels.length,
        col4: sumArea,
      });

      //console.log("objectProperties", objectProperties);
    }

    await this.setState({ rowsGrid0: buildings.map((row) => ({ ...row })) });

    let props = await FormIt.Model.GetPropertiesForSelected();

    for (var k = 0; k < selection.length; k++) {
      let historyDepth = selection[k]["ids"].length - 1;

      let a = selection[k]["ids"][historyDepth];

      let id = a["Object"];

      var objectProperties = await WSM.APIGetObjectPropertiesReadOnly(
        historyDepth,
        id
      );
      console.log("objectProperties", objectProperties);
      // bReportAreaByLevel: true
      // sObjectName: "lkjkjskldjjlLVFJLJLJKJKLJKLJKLJ"

      if (objectProperties.bReportAreaByLevel) {
        console.log(objectProperties.bReportAreaByLevel);
      } else {
        console.log(objectProperties.bReportAreaByLevel);
      }

      var objectName = await WSM.APIGetObjectNameReadOnly(historyDepth, id);
      console.log(objectName);

      var APIGetObjectAttributesReadOnly =
        await WSM.APIGetObjectAttributesReadOnly(historyDepth, id);
      console.log(
        "APIGetObjectAttributesReadOnly",
        APIGetObjectAttributesReadOnly
      );

      let props = await FormIt.Model.GetPropertiesForSelected();
      console.log(props);

      let getObjectName = await FormIt.Model.GetObjectName(id);
      console.log("getObjectName", getObjectName);

      let getProjectSiteArea = await FormIt.Model.GetProjectSiteArea();
      console.log("getProjectSiteArea", getProjectSiteArea);

      let getProjectTargetArea = await FormIt.Model.GetProjectTargetArea();
      console.log("getProjectTargetArea", getProjectTargetArea);

      let getBuildingType = await FormIt.GetBuildingType();
      console.log("getBuildingType", getBuildingType);

      let getAllLayers = await FormIt.Layers.GetAllLayers();
      console.log("getAllLayers", getAllLayers);

      let getAllLayerData = await FormIt.Layers.GetAllLayerData();
      console.log("getAllLayerData", getAllLayerData);

      let datas = [];
      for (var m = 0; m < getAllLayers.length; m++) {
        let getLayerData = await FormIt.Layers.GetLayerData(getAllLayers[m]);

        datas.push({
          id: getLayerData.Id,
          col1: getLayerData.Name,
          col2: getLayerData.Pickable,
          col3: getLayerData.Visible,
        });
        console.log("getLayerData", getLayerData);
      }

      await this.setState({ rows: datas.map((row) => ({ ...row })) });
      console.log("this.setState", this.state.rows);

      let getObjectLayerID = await FormIt.Layers.GetObjectLayerID(
        historyDepth,
        id
      );
      console.log("getObjectLayerID", getObjectLayerID);

      //let getLayerData = await FormIt.Layers.GetLayerData(getObjectLayerID);

      //console.log("getLayerData", getLayerData);

      let objectReportsAreaByLevel =
        await FormIt.Model.ObjectReportsAreaByLevel(id);
      console.log("objectReportsAreaByLevel", objectReportsAreaByLevel);

      let getTotalGrossArea = await FormIt.Model.GetTotalGrossArea();
      console.log("getTotalGrossArea", getTotalGrossArea);
      // getTotalGrossArea 3288

      // Level Id 전체 가져오기
      let getLevels = await FormIt.Levels.GetLevels(historyDepth, true);
      console.log("getLevels", getLevels);

      // Level Data 전체 가져오기
      let getLevelsData = await FormIt.Levels.GetLevelsData(historyDepth, true);
      console.log("getLevelsData", getLevelsData);

      // 레벨 중 최고 높은 것의 elevation 가져오기
      let getMaxLevelElevation = await FormIt.Levels.GetMaxLevelElevation(
        historyDepth
      );
      console.log("getMaxLevelElevation", getMaxLevelElevation);

      // 레벨 중 최고 낮은 것의 elevation 가져오기
      let getMinLevelElevation = await FormIt.Levels.GetMinLevelElevation(
        historyDepth
      );
      console.log("getMinLevelElevation", getMinLevelElevation);

      // 선택한 오브젝트의 레벨 ID 가져오기
      let getLevelIDsFromSelectedObjects =
        await FormIt.Levels.GetLevelIDsFromSelectedObjects(historyDepth);
      console.log(
        "getLevelIDsFromSelectedObjects",
        getLevelIDsFromSelectedObjects
      );

      console.log("this.props.tableData", this.props.tableData);
      this.setState({ tableData: this.props.tableData });

      //----------------------

      //FormIt.Model.SetObjectName(id, "lkjkjskldjjlLVFJLJLJKJKLJKLJKLJ");

      // get the name of this object, then push the results into an array
      //var objectName = objectProperties.sObjectName;

      //console.log(objectName);

      //console.log("Object ID: " + id);

      //let objName = FormIt.Model.ObjectReportsAreaByLevel(id);

      //console.log("ObjectReportsAreaByLevel: " + objName);

      // let objProperties = FormIt.Model.GetPropertiesForSelected(a["Object"]);

      // console.log("objProperties: " + objProperties.length);

      // for (var m = 0; m < objProperties.length; j++) {
      //   let aaa = objProperties[m];
      //   console.log("objProperty: " + aaa);
      // }

      //console.log("Object Name: " + objName);
      //console.log("objProperties: " + objProperties);
      // let levels = await FormIt.Levels.GetLevelsData(historyDepth, true);

      // for (var m = 0; m < levels.length; m++) {
      //   let nLevelID = levels[m]["Id"]["Object"];
      //   console.log(levels[m]);
      //   //let nLevelID = levels[m]["Id"][historyDepth]["Object"];
      //   //await FormIt.Levels.ChangeLevelElevation(historyDepth, nLevelID, 15);

      //   let nObjectID = aCurrentSelection[j]["ids"][historyDepth]["Object"];

      //   let dArea = await FormIt.Levels.GetAreaForObjects(
      //     historyDepth,
      //     nLevelID,
      //     nObjectID
      //   );

      //   //console.log(dArea);
    }

    //let isLevel = await FormIt.Levels.IsExistingLevel(historyDepth, "level1");
    //let level = await FormIt.Levels.GetLevelData(historyDepth, "level1");
    //}

    console.log("handleGetArea: end");
  }

  // 동/층별 면적표
  async handleGetAreaPerDong(e) {
    console.log("handleGetAreaPerDong: start");

    let history = 0;

    let allBody = await WSM.APIGetAllObjectsByTypeReadOnly(history, 1); // 1=nBodyType

    let levels = [];

    let id = 0;
    for (var i = 0; i < allBody.length; i++) {
      let curId = allBody[i];

      var objectProps = await WSM.APIGetObjectPropertiesReadOnly(
        history,
        curId
      );

      // 현재 body의 levels 가져오기
      var objectLevels = await WSM.APIGetObjectLevelsReadOnly(history, curId);
      let levelsData = [];

      for (var j = 0; j < objectLevels.length; j++) {
        let curLevelId = objectLevels[j];
        let area = await FormIt.Levels.GetAreaForObjects(
          history,
          curLevelId,
          curId
        );
        if (area === 0) {
          continue;
        }

        let levelData = await WSM.APIGetLevelDataReadOnly(history, curLevelId);

        let data = {
          id: curLevelId,
          dElevation: levelData.dElevation,
          sLevelName: levelData.sLevelName,
        };
        levelsData.push(data);
      }

      // elevation으로 정렬 (지하->지상)
      levelsData.sort(function (a, b) {
        if (a.dElevation > b.dElevation) {
          return 1;
        }
        if (a.dElevation < b.dElevation) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });

      let firstLevelId = levelsData[0].id;

      let beforeLevelArea = await FormIt.Levels.GetAreaForObjects(
        history,
        firstLevelId,
        curId
      );

      beforeLevelArea = Number(beforeLevelArea.toFixed(2));

      let beforeLevelName = "";
      let lastLevelName = "";

      let floorCount = 0;

      let curArea = 0;
      let beforeArea = 0;
      let strLevel = "";

      let bPush = false;

      for (var k = 0; k < levelsData.length; k++) {
        let curLevelId = levelsData[k].id;
        let curLevelName = levelsData[k].sLevelName;
        curArea = await FormIt.Levels.GetAreaForObjects(
          history,
          curLevelId,
          curId
        );
        curArea = this.convertUnit(curArea, FormIt.UnitType.kMetricMeter);
        curArea = Number(curArea.toFixed(2));

        if (beforeArea === 0) {
          beforeArea = curArea;
          beforeLevelName = curLevelName;
          floorCount++;
          continue;
        }

        if (curArea !== beforeArea) {
          if (floorCount === 1) {
            strLevel = beforeLevelName;
          } else {
            strLevel = beforeLevelName + "~" + lastLevelName;
          }
          levels.push({
            id: id,
            col1: objectProps.sObjectName,
            col2: strLevel,
            col3: floorCount,
            col4: beforeArea,
          });

          floorCount = 1;
          bPush = true;
          beforeArea = curArea;
          beforeLevelName = curLevelName;
        } else {
          lastLevelName = curLevelName;
          floorCount++;
          id++;
        }
      }

      id++;

      if (bPush && floorCount > 0) {
        if (floorCount === 1) {
          strLevel = beforeLevelName;
        } else {
          strLevel = beforeLevelName + "~" + lastLevelName;
        }
        levels.push({
          id: id,
          col1: objectProps.sObjectName,
          col2: strLevel,
          col3: floorCount,
          col4: beforeArea,
        });
      } else if (bPush === false && floorCount > 0) {
        levels.push({
          id: id,
          col1: objectProps.sObjectName,
          col2: beforeLevelName + "~" + lastLevelName,
          col3: floorCount,
          col4: beforeArea,
        });
      }

      // for (var m = 0; m < levelsData.length; m++) {
      //   let afterLevelId = levelsData[m].id;
      //   let curLevelId = levelsData[m].id;
      //   curLevelName = levelsData[m].sLevelName;
      //   curElevation = levelsData[m].dElevation;
      //   curArea = await FormIt.Levels.GetAreaForObjects(
      //     history,
      //     curLevelId,
      //     curId
      //   );
      //   beforeArea = await FormIt.Levels.GetAreaForObjects(
      //     history,
      //     afterLevelId,
      //     curId
      //   );
      //   //curArea = Number(curArea.toFixed(2));

      //   if (curElevation < 0) {
      //     // 지하일때
      //     console.log("지하", objectProps.sObjectName, curLevelName);
      //   } else {
      //     // 지상일때
      //     if (curArea === beforeArea) {
      //       console.log("지상", objectProps.sObjectName, curLevelName);
      //     }
      //   }

      //   id++;
      // }

      await this.setState({ rowsGrid1: levels.map((row) => ({ ...row })) });
    }

    console.log("handleGetAreaPerDong: end");
  }

  render() {
    const filteredComponents = (data) => {
      data = data.filter((c) => {
        return c.NM_PROJ.indexOf(this.state.searchKeyword) > -1;
      });
      return data.map((c) => {
        return (
          <Project
            stateRefresh={this.stateRefresh}
            key={c.ID}
            id={c.ID}
            cd={c.CD_PROJ}
            name={c.NM_PROJ}
            onRowClick={this.handleClick}
          />
        );
      });
    };

    const { classes } = this.props;
    const cellList = ["ID", "Code", "Name"];

    const colsGrid0 = [
      { field: "col1", headerName: "용도", width: 100 },
      { field: "col2", headerName: "동", width: 100 },
      { field: "col3", headerName: "층수", width: 100 },
      { field: "col4", headerName: "연면적", width: 120 },
    ];
    const colsGrid1 = [
      { field: "col1", headerName: "동", width: 100 },
      { field: "col2", headerName: "구분", width: 100 },
      { field: "col3", headerName: "층수", width: 100 },
      { field: "col4", headerName: "면적", width: 120 },
    ];

    const _rows = [
      { id: 1, col1: "Hello", col2: "World", col3: "hjh" },
      { id: 2, col1: "DataGridPro", col2: "is Awesome", col3: "jhj" },
      { id: 3, col1: "MUI", col2: "is Amazing", col3: "hgg" },
    ];

    const _columns = [
      { field: "col1", headerName: "Column 1", width: 150 },
      { field: "col2", headerName: "Column 2", width: 150 },
      { field: "col3", headerName: "Column 3", width: 150 },
    ];

    console.log(this.state.projectInfo);

    return (
      <div className={classes.root}>
        {/* <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Open drawer"
            >
              <MenuIcon />
            </IconButton>
            <Typography
              className={classes.title}
              variant="h6"
              color="inherit"
              noWrap
            >
              규모검토시스템
            </Typography>
            <div className={classes.grow} />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="검색하기"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                name="searchKeyword"
                value={this.state.searchKeyword}
                onChange={this.handleValueChange}
              />
            </div>
          </Toolbar>
        </AppBar>
        <Paper variant="outlined" className={classes.paper}>
          <Table>
            <TableHead>
              <TableRow>
                {cellList.map((c) => {
                  return (
                    <TableCell key={c} className={classes.tableHead}>
                      {c}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.projects ? (
                filteredComponents(this.state.projects)
              ) : (
                <TableRow>
                  <TableCell colSpan="6" align="center">
                    <CircularProgress
                      className={classes.progress}
                      variant="determinate"
                      value={this.state.completed}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
        <br />
        <div className={classes.subtitle}>Project Infomation</div>
        <br />
        <Paper className={classes.paper}>
          <Stack spacing={2}>{this.state.projectInfo}</Stack>
        </Paper>

        <br /> */}

        <div style={{ height: 400, width: "100%" }}>
          <DataGrid rows={this.state.projectInfo} columns={_columns} />
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={this.handleGetLayer}
        >
          설정
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={this.handleGetArea}
        >
          용도별면적표
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={this.handleGetAreaPerDong}
        >
          동/층별면적표
        </Button>

        <br />
        <div className={classes.subtitle}>면적 정보</div>
          <DataTable
            checkbox={false}
            height={300}
            rows={this.state.rowsGrid0}
            columns={colsGrid0}
          />
          <DataTable
            checkbox={false}
            height={500}
            rows={this.state.rowsGrid1}
            columns={colsGrid1}
          />
      </div>
    );
  }
}

export default withStyles(styles)(App);