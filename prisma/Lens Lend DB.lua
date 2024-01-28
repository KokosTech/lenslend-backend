Lens Lend DB

User
- uuid
- name
- email
- phone
- password
- type (normal user, owner (of a place), mod, admin)
- verified_email
- verified_phone
- profile_pic
- header_pic
- bio
- rating (m2m)
- created_on

(Also a table for hist - email and old pass hashes)

User_Settings
- user_uuid
- preferred_theme
- marketing_emails
- in_app_notifications
- email_notifications

(User checked out - down with places m2m)

User_Saved
- user_uuid
- listing_uuid (null)
- place_uuid (null)
- created_on

——

Listing (equipment or services) 
- uuid
- type
- title
- description
- category
- rating (m2m)
- state (only for equipment)
- price (if null -> to be made)
- rental (value in hours, if null -> selling)
- comment (t or f -> variable price w or w/o comment)
- status (public, private, banned)
- created_on
- user_uuid

Listing_Pictures
- uuid
- listing_uuid
- picture_url
- status
- created_on
- user_uuid

Listing_Tags
- listing_uuid
- tag_uuid

Tag
- uuid
- name
- status (ok / banned)

——

Place
- uuid
- rev
- name
- description
- category
- log
- lat
- status
- created_on
- author_uuid
- owner_uuid

Place_Services
- place_uuid
- services_uuid

Services
- uuid
- name
- color
- bg_color
- dark_color
- dark_bg_color
- icon

Place_Pictures
- uuid
- place_uuid
- status
- created_on
- picture_url

Place_Hist
- uuid
- place_uuid
- rev
- name
- description
- log
- lat
- status
- created_on
- author_uuid
- owner_uuid

Place_Editor
- author_uuid
- place_hist_uuid
- edited_on

Place_Checkout (who’s been here)
- place_uuid
- user_uuid
- created_on

Place_Review
- uuid
- title (nullable)
- description (nullable)
- rating
- status
- created_on
- place_uuid
- user_uuid

Place_Review_Image
- uuid
- review_image_uuid
- status
- img_url

(same tables but for users and services & also a hist table just like the user and places one)

Place_Tags
- place_uuid
- tag_uuid

Review_Reply
- uuid
- review_id
- parent_id (nullable)
- user_id
- content
- status
- created_on