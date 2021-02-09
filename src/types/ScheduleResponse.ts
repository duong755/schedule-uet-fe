export namespace ScheduleResponse {
  export type ClassInfo = {
    _id: string;
    TenMonHoc: string;
    MaLopMH: string;
    GiaoVien: string;
    SoSV: string;
    Buoi: string;
    Thu: number;
    Tiet: number[];
    GiangDuong: string;
    GhiChu: string;
  };

  export type StudentInfo = {
    MaSV: string;
    HoVaTen: string;
    LopKhoaHoc: string;
    NgaySinh: string;
  };

  export type Response = {
    message: string;
    data: {
      studentInfo: StudentInfo;
      classes: ClassInfo[];
    };
  };
}
