import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, BeforeUpdate, OneToMany, ManyToOne } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {
    @ApiProperty({
      example: '3fa85f64-5717-4562-b3fc-2c963f66',
      description: 'Product ID',
      uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string
    
    @ApiProperty({
      example: 'T-Shirt',
      description: 'Product title',
      uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    title: string

    @ApiProperty()
    @Column('numeric', {
        default: 0
    })
    price: number

    @ApiProperty()
    @Column({
        type: 'text',
        nullable: true
    })
    description: string

    @ApiProperty()
    @Column({
        type: 'text',
        unique: true,
        nullable: true
    })
    slug: string

    @ApiProperty()
    @Column('int', {
        default: 0
    })
    stock: Number

    @ApiProperty()
    @Column('text', {
        array: true
    })
    sizes: string[]

    @ApiProperty()
    @Column('text')
    gender: string
    
    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[]

    @ManyToOne(
      () => User,
      (user) => user.product,
      {eager: true}
    )
    user: User

    @BeforeInsert()
    checkSlug() {

      if (!this.slug) {
        this.slug = this.title
      }

      this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll("'", '')

    }

    @BeforeUpdate()
    checkSlugUpdate() {

      this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll("'", '')
  
    }

}
