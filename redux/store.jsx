import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/auth-slice";
import noticeSlice from "./slice/notice-slice";
import newslatterSlice from "./slice/newslatter-slice";
import bannerSlice from "./slice/banner-slice";
import categorySlice from "./slice/category-slice";
import userSlice from "./slice/user-slice";
import blogSlice from "./slice/blog-slice";
import bookandnewslatterSlice from "./slice/bookandnewslatter-slice";
import courceSlice from "./slice/course-slice";
import dashboardSlice from "./slice/dashboard-slice";
import gallerySlice from "./slice/gallery-slice";
import trainerreportsSlice from "./slice/reports-slice";
import cordinateSlice from "./slice/cordinate-slice";
import candidateSlice from "./slice/candidate-slice";
import talentSlice from "./slice/talent-slice";
import governingCouncilSlice from "./slice/governing-council-slice";
import teamMembersSlice from "./slice/team-members-slice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    banner: bannerSlice,
    blog: blogSlice,
    book: bookandnewslatterSlice,
    category: categorySlice,
    cource: courceSlice,
    dashboard: dashboardSlice,
    gallery: gallerySlice,
    newslatter: newslatterSlice,
    notice: noticeSlice,
    user: userSlice,
    trainerreport: trainerreportsSlice,
    cordinate: cordinateSlice,
    candidate: candidateSlice,
    talent: talentSlice,
    governingCouncil: governingCouncilSlice,
    teamMembers: teamMembersSlice,
  },
});