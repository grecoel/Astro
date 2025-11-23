import React from "react";
import { Avatar } from "./Avatar";
import { Div } from "./Div";
import { DivWrapper } from "./DivWrapper";
import { Group } from "./Group";
import { Group1 } from "./Group1";
import { Group2 } from "./Group2";
import { GroupWrapper } from "./GroupWrapper";
import { SectionComponentNode } from "./SectionComponentNode";
import { Verify } from "./Verify";
import bannerMasked from "./banner-masked.png";
import iconElektronik from "./icon-elektronik.png";
import rectangle6 from "./rectangle-6.svg";
import rectangle10 from "./rectangle-10.svg";
import rectangle292 from "./rectangle-29-2.svg";
import rectangle293 from "./rectangle-29-3.svg";
import rectangle294 from "./rectangle-29-4.svg";
import rectangle295 from "./rectangle-29-5.svg";
import rectangle296 from "./rectangle-29-6.svg";
import rectangle29 from "./rectangle-29.png";
import rectangle291 from "./rectangle-29.svg";
import "./style.css";
import untitledDesign122 from "./untitled-design-12-2.svg";
import untitledDesign201 from "./untitled-design-20-1.png";

export const UiDesktopKatalog = () => {
  return (
    <div className="ui-desktop-katalog">
      <div className="rectangle-21" />

      <img className="rectangle-22" alt="Rectangle" src={rectangle6} />

      <img className="rectangle-23" alt="Rectangle" src={rectangle10} />

      <Group />
      <GroupWrapper />
      <DivWrapper />
      <Div />
      <SectionComponentNode />
      <Group1 />
      <div className="rectangle-24" />

      <div className="text-wrapper-55">Kategori</div>

      <div className="group-8">
        <div className="rectangle-25" />

        <img className="img-2" alt="Rectangle" src={rectangle291} />

        <div className="text-wrapper-56">Alat Lab</div>
      </div>

      <div className="group-9">
        <div className="rectangle-26" />

        <div className="text-wrapper-57">?</div>
      </div>

      <div className="group-9">
        <div className="rectangle-26" />

        <div className="text-wrapper-57">?</div>
      </div>

      <div className="group-10">
        <div className="group-11">
          <div className="rectangle-25" />

          <img className="img-2" alt="Rectangle" src={rectangle292} />

          <div className="text-wrapper-56">Pakaian</div>
        </div>
      </div>

      <div className="group-12">
        <div className="group-11">
          <div className="rectangle-25" />

          <img className="img-2" alt="Icon elektronik" src={iconElektronik} />

          <div className="text-wrapper-56">Elektronik</div>
        </div>
      </div>

      <div className="group-13">
        <div className="group-11">
          <div className="rectangle-25" />

          <img className="img-2" alt="Rectangle" src={rectangle293} />

          <div className="text-wrapper-56">Kosmetik</div>
        </div>
      </div>

      <div className="group-14">
        <div className="rectangle-25" />

        <img className="rectangle-27" alt="Rectangle" src={rectangle294} />

        <div className="text-wrapper-56">Olahraga</div>
      </div>

      <div className="group-15">
        <div className="group-11">
          <div className="rectangle-25" />

          <img className="img-2" alt="Rectangle" src={rectangle295} />

          <div className="text-wrapper-58">Alat Tulis</div>
        </div>
      </div>

      <div className="group-16">
        <div className="group-11">
          <div className="rectangle-25" />

          <img className="img-2" alt="Rectangle" src={rectangle296} />

          <div className="text-wrapper-56">Buku Kuliah</div>
        </div>
      </div>

      <Verify className="verify-instance" />
      <Verify className="icon-instance-node" />
      <Verify className="verify-2" />
      <Verify className="verify-3" />
      <Verify className="verify-4" />
      <Verify className="verify-5" />
      <div className="rectangle-28" />

      <div className="text-wrapper-59">Ma</div>

      <img className="rectangle-29" alt="Rectangle" src={rectangle29} />

      <Group2 />
      <div className="rectangle-30" />

      <div className="rectangle-31" />

      <div className="text-wrapper-60">Cari Produk</div>

      <div className="ellipse" />

      <div className="ellipse-2" />

      <div className="ellipse-3" />

      <div className="text-wrapper-61">Astro</div>

      <div className="group-17">
        <Avatar
          className="avatar-instance"
          shape="circle"
          size="large"
          type="image"
        />
        <div className="dashboard-penjual">
          Dashboard
          <br />
          Penjual
        </div>
      </div>

      <img
        className="untitled-design"
        alt="Untitled design"
        src={untitledDesign201}
      />

      <img className="banner-masked" alt="Banner masked" src={bannerMasked} />

      <img
        className="untitled-design-2"
        alt="Untitled design"
        src={untitledDesign122}
      />
    </div>
  );
};
