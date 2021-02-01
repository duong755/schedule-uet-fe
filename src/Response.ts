export type ClassInfo = {
  Buoi: string;
  GiangDuong: string;
  GiaoVien: string;
  MaLopMH: string;
  TenMonHoc: string;
  SoSV: number | string;
  Thu: number | string;
  Tiet: string | number[];
  _id: string;
  id: string;
};

export type StudentInfo = {
  MaSV: string;
  HoVaTen: string;
  LopKhoaHoc: string;
  NgaySinh: string;
};

export type ResponseItem = {
  GhiChu: string;
  HoVaTen: string;
  LopKhoaHoc: string;
  MaLMH: string;
  MaSV: string;
  NgaySinh: string;
  SoTinChi: number | string;
  TenMonHoc: string;
  _id: string;
  id: string;
  ThongTinLopHoc: ClassInfo;
};

export type Response = {
  message: string;
  data: ResponseItem[]
};
